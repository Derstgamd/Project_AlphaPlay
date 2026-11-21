"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sfx } from "./sfx";
import {
  TASK_LIMIT_MS,
  TOTAL_TASKS,
  createRunSeed,
  getFatherTasks,
  getRohanTasks,
  loadDualScores,
  saveDualScore,
} from "./tasks";

function buildInitialRun(role, runId = 1) {
  return {
    phase: "ready", // "ready" | "playing" | "ended"
    role,
    runId,
    seed: createRunSeed(),
    taskIndex: 0,
    taskStartedAt: 0,
    timeLeftMs: TASK_LIMIT_MS,
    score: 0,
    milestones: [],
    slips: [],
    passedTasks: [],
    endReason: null, // "victory" | "timeout" | "wrong"
    failedAtTask: null,
    failDetail: "",
    spoofZone: null,
  };
}

/**
 * Manages the 10-task sequential Wipeout run (15s per task, dual /3 scoring).
 * - Subir (father): failing or timing out ANY task (1–10) immediately ends the run.
 * - Rohan (rohan): failing or timing out Tasks 1–7 logs a slip and advances;
 *   failing or timing out Tasks 8–10 immediately ends the run.
 */
export function useTaskRun(activeRole, onToast) {
  const [run, setRun] = useState(() => buildInitialRun(activeRole || "father", 1));
  const [dualScores, setDualScores] = useState({
    fatherBest: 0,
    rohanBest: 0,
    fatherLast: null,
    rohanLast: null,
  });

  const runRef = useRef(run);
  const toastRef = useRef(onToast);
  const lastWarnSecRef = useRef(null);

  useEffect(() => {
    runRef.current = run;
  }, [run]);

  useEffect(() => {
    toastRef.current = onToast;
  }, [onToast]);

  // Hydrate persisted /3 scores on client mount without sync setState-in-effect
  useEffect(() => {
    const t = setTimeout(() => {
      setDualScores(loadDualScores());
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const tasks = useMemo(
    () => (run.role === "father" ? getFatherTasks(run.seed) : getRohanTasks(run.seed)),
    [run.role, run.seed]
  );

  const currentTask = tasks[Math.min(run.taskIndex, tasks.length - 1)] || tasks[0];

  const beginRun = useCallback(() => {
    const cur = runRef.current;
    const now = Date.now();
    lastWarnSecRef.current = null;
    sfx.unlock();
    sfx.go();
    const next = {
      ...cur,
      phase: "playing",
      taskIndex: 0,
      taskStartedAt: now,
      timeLeftMs: TASK_LIMIT_MS,
      score: 0,
      milestones: [],
      slips: [],
      passedTasks: [],
      endReason: null,
      failedAtTask: null,
      failDetail: "",
      spoofZone: null,
    };
    runRef.current = next;
    setRun(next);
  }, []);

  const restart = useCallback((nextRole, autoStart = false) => {
    const cur = runRef.current;
    const targetRole = nextRole || cur.role;
    const nextId = cur.runId + 1;
    lastWarnSecRef.current = null;
    let next = buildInitialRun(targetRole, nextId);
    if (autoStart) {
      const now = Date.now();
      sfx.unlock();
      sfx.go();
      next = {
        ...next,
        phase: "playing",
        taskStartedAt: now,
      };
    }
    runRef.current = next;
    setRun(next);
  }, []);

  const passTask = useCallback((detail, extra = null) => {
    const cur = runRef.current;
    if (cur.phase !== "playing") return;

    const list =
      cur.role === "father" ? getFatherTasks(cur.seed) : getRohanTasks(cur.seed);
    const task = list[cur.taskIndex];
    if (!task) return;

    const nextScore = task.milestone ? Math.min(3, cur.score + 1) : cur.score;
    const nextMilestones = task.milestone
      ? [...cur.milestones, task.milestoneLabel]
      : cur.milestones;
    const nextPassed = [...cur.passedTasks, task.num];

    if (cur.taskIndex >= TOTAL_TASKS - 1) {
      sfx.win();
      const saved = saveDualScore(cur.role, nextScore);
      setDualScores(saved);
      toastRef.current?.(detail || `★ ${task.milestoneLabel}`, "good");
      const next = {
        ...cur,
        ...(extra || {}),
        phase: "ended",
        score: nextScore,
        milestones: nextMilestones,
        passedTasks: nextPassed,
        endReason: "victory",
        failedAtTask: null,
        failDetail: "",
      };
      runRef.current = next;
      setRun(next);
      return;
    }

    if (task.milestone) {
      sfx.milestone();
      const saved = saveDualScore(cur.role, nextScore);
      setDualScores(saved);
    } else {
      sfx.good();
    }

    const now = Date.now();
    lastWarnSecRef.current = null;
    toastRef.current?.(
      detail ||
        (task.milestone
          ? `★ ${task.milestoneLabel}! Next: Task ${task.num + 1}`
          : `✅ Task ${task.num} cleared! Next: Task ${task.num + 1}`),
      "good"
    );

    const next = {
      ...cur,
      ...(extra || {}),
      taskIndex: cur.taskIndex + 1,
      taskStartedAt: now,
      timeLeftMs: TASK_LIMIT_MS,
      score: nextScore,
      milestones: nextMilestones,
      passedTasks: nextPassed,
    };
    runRef.current = next;
    setRun(next);
  }, []);

  const failTask = useCallback((reason = "wrong", detail = "") => {
    const cur = runRef.current;
    if (cur.phase !== "playing") return;

    const list =
      cur.role === "father" ? getFatherTasks(cur.seed) : getRohanTasks(cur.seed);
    const task = list[cur.taskIndex];
    if (!task) return;

    // Special Rohan rule: Tasks 1–7 do NOT end the run; fail ends run starting from Task 8.
    if (cur.role === "rohan" && cur.taskIndex < 7) {
      sfx.slip();
      const now = Date.now();
      lastWarnSecRef.current = null;
      const slipMsg =
        detail ||
        (reason === "timeout"
          ? `15s cutoff missed on Task ${task.num}`
          : `Wrong call on Task ${task.num}`);
      toastRef.current?.(
        `⚠️ Slip on Task ${task.num} — Rohan stays alive! Moving to Task ${task.num + 1} (Sudden death starts at Task 8).`,
        "bad"
      );
      const next = {
        ...cur,
        taskIndex: cur.taskIndex + 1,
        taskStartedAt: now,
        timeLeftMs: TASK_LIMIT_MS,
        slips: [
          ...cur.slips,
          { taskNum: task.num, title: task.title, reason: slipMsg },
        ],
      };
      runRef.current = next;
      setRun(next);
      return;
    }

    // Father (Tasks 1–10) OR Rohan (Tasks 8–10): run ends immediately
    sfx.bad();
    sfx.lose();
    const saved = saveDualScore(cur.role, cur.score);
    setDualScores(saved);
    const finalMsg =
      detail ||
      (reason === "timeout"
        ? `15.0s cutoff expired on Task ${task.num}: ${task.title}`
        : `Wrong action on Task ${task.num}: ${task.title}`);
    toastRef.current?.(`❌ ${finalMsg}`, "bad");

    const next = {
      ...cur,
      phase: "ended",
      endReason: reason,
      failedAtTask: task.num,
      failDetail: finalMsg,
      timeLeftMs: reason === "timeout" ? 0 : cur.timeLeftMs,
    };
    runRef.current = next;
    setRun(next);
  }, []);

  // 15-second per-task countdown ticker
  useEffect(() => {
    if (run.phase !== "playing") return;
    const id = setInterval(() => {
      const cur = runRef.current;
      if (cur.phase !== "playing") return;
      const now = Date.now();
      const left = Math.max(0, TASK_LIMIT_MS - (now - cur.taskStartedAt));

      if (left <= 5000 && left > 0) {
        const sec = Math.ceil(left / 1000);
        if (lastWarnSecRef.current !== sec) {
          lastWarnSecRef.current = sec;
          sfx.tick();
          sfx.heartbeat();
        }
      }

      if (left <= 0) {
        failTask("timeout");
        return;
      }

      setRun((prev) => (prev.phase === "playing" ? { ...prev, timeLeftMs: left } : prev));
    }, 100);
    return () => clearInterval(id);
  }, [run.phase, run.runId, failTask]);

  // Lightweight MapBoard-compatible state object
  const mapGameState = useMemo(() => {
    const isF = run.role === "father";
    const clearedZones = [];
    if (isF) {
      if (run.passedTasks.includes(1)) clearedZones.push(run.seed.decoyZone);
      if (run.passedTasks.includes(4) && !clearedZones.includes("saltlake")) {
        clearedZones.push("saltlake");
      }
    } else if (run.taskIndex === 9) {
      clearedZones.push(run.seed.thirdNeighbor);
    }

    const pings = [];
    if (isF && run.taskIndex >= 4) {
      pings.push({
        zone: run.seed.blockedNeighbor,
        result: "weak",
        at: Number.MAX_SAFE_INTEGER,
      });
    }
    if (isF && run.taskIndex === 9) {
      pings.push({
        zone: run.seed.suvZone,
        result: "strong",
        at: Number.MAX_SAFE_INTEGER,
      });
    }

    const showRoadblock = run.taskIndex === 9;
    return {
      suvZone: run.seed.suvZone,
      clearedZones,
      pings,
      raids: [],
      raidInFlight: null,
      blips: [],
      fakePing: run.spoofZone
        ? { zone: run.spoofZone, expiresAt: Number.MAX_SAFE_INTEGER }
        : null,
      traceUntil: isF && run.taskIndex === 9 ? Number.MAX_SAFE_INTEGER : 0,
      roadblock: showRoadblock
        ? {
            a: run.seed.suvZone,
            b: run.seed.blockedNeighbor,
            expiresAt: Number.MAX_SAFE_INTEGER,
          }
        : null,
    };
  }, [run.role, run.seed, run.taskIndex, run.passedTasks, run.spoofZone]);

  return {
    run,
    tasks,
    currentTask,
    dualScores,
    mapGameState,
    beginRun,
    restart,
    passTask,
    failTask,
  };
}
