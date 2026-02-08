"use client";

import { useState, useRef, useEffect } from "react";

const SCENE_COUNT = 4;
const LONG_PRESS_MS = 500;
const REMIX_DELAY_MS = 1500;
const REMIX_RESULT_TEXT = "갑자기 비트코인 대신 도지코인이 폭등했다! 🐕";

type StoryCardProps = {
  scenes: string[];
};

export default function StoryCard({ scenes }: StoryCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [directorMode, setDirectorMode] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isRemixing, setIsRemixing] = useState(false);
  const [remixResult, setRemixResult] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(true);

  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const justEnteredDirectorModeRef = useRef(false);
  const remixTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current !== null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (remixTimeoutRef.current) clearTimeout(remixTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 3800);
    return () => clearTimeout(t);
  }, []);

  const goNext = () => {
    setRemixResult(null);
    setCurrentIndex((prev) => (prev + 1) % SCENE_COUNT);
  };

  const handleRemixClick = () => {
    setIsRemixing(true);
    if (remixTimeoutRef.current) clearTimeout(remixTimeoutRef.current);
    remixTimeoutRef.current = setTimeout(() => {
      remixTimeoutRef.current = null;
      setRemixResult(REMIX_RESULT_TEXT);
      setIsRemixing(false);
      setDirectorMode(false);
    }, REMIX_DELAY_MS);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (directorMode) {
      return;
    }
    setIsPressed(true);
    clearLongPressTimer();
    longPressTimerRef.current = setTimeout(() => {
      longPressTimerRef.current = null;
      setDirectorMode(true);
      justEnteredDirectorModeRef.current = true;
    }, LONG_PRESS_MS);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    clearLongPressTimer();
    setIsPressed(false);

    if (directorMode) {
      if (justEnteredDirectorModeRef.current) {
        justEnteredDirectorModeRef.current = false;
      } else {
        setDirectorMode(false);
      }
      return;
    }

    goNext();
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    clearLongPressTimer();
    setIsPressed(false);
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.buttons === 0) return;
    clearLongPressTimer();
    setIsPressed(false);
  };

  const displayScenes = scenes.slice(0, SCENE_COUNT);
  const currentText = remixResult ?? (displayScenes[currentIndex] ?? "");
  const isShowingRemixResult = remixResult !== null;

  const sceneImageUrl = `https://picsum.photos/seed/${currentIndex}/800/1600`;

  return (
    <div
      className="relative h-full w-full cursor-pointer overflow-hidden transition-transform duration-500 ease-out"
      style={{ transform: isPressed ? "scale(0.95)" : "scale(1)" }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerLeave}
      onContextMenu={(e) => e.preventDefault()}
      role="button"
      aria-label={directorMode ? "감독 모드" : "다음 씬으로"}
    >
      {/* 풀스크린 배경 — Picsum(안정), absolute 고정 */}
      <div className="relative h-full w-full overflow-hidden">
        <img
          src={sceneImageUrl}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover -z-10 transition-all duration-500 ease-out ${
            directorMode ? "scale-105 blur-md" : "scale-100 blur-0"
          }`}
        />
      </div>

      {/* 영화적 비네팅 — 테두리 어둡게, 중앙 시선 집중 */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] opacity-90"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
        aria-hidden
      />

      {/* 감독 모드: 진한 보라색 글로우 (테두리 느낌) */}
      <div
        className={`pointer-events-none absolute inset-0 transition-shadow duration-500 ${
          directorMode
            ? "shadow-[inset_0_0_0_2px_rgba(139,92,246,0.8),0_0_60px_30px_rgba(139,92,246,0.4)]"
            : "shadow-none"
        }`}
        aria-hidden
      />

      {/* 상단 인디케이터 — 간격 두고, 본 씬=흰색 / 안 본 씬=반투명 회색 */}
      <div className="absolute left-0 right-0 top-0 z-10 flex gap-2 px-5 pt-6">
        {Array.from({ length: SCENE_COUNT }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/25"
          >
            <div
              className="h-full rounded-full bg-white transition-all duration-300 ease-out"
              style={{
                width: currentIndex >= i ? "100%" : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* 영화 자막 — 하단 그라데이션 진하게(글자 가독) + 모바일·PC 반응형, 하단 여백(pb-12) */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent pb-12 pt-24 px-5"
        aria-hidden
      />
      <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-12 pt-24">
        <p
          key={isShowingRemixResult ? "remix" : currentIndex}
          className={`font-cinema max-w-2xl mx-auto text-center font-medium text-white text-lg leading-relaxed text-story-caption break-keep md:text-2xl ${
            isShowingRemixResult ? "animate-shake" : "animate-float-in"
          }`}
        >
          {currentText}
        </p>
      </div>

      {/* 처음 한 번만: 탭/감독 안내 힌트 (깜빡이다가 사라짐), 하단 바 위로 */}
      <div
        className={`absolute bottom-14 left-0 right-0 z-10 flex justify-center transition-opacity duration-500 ${
          showHint ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
      >
        <span className="font-cinema text-[11px] text-white/70 animate-hint-pulse sm:text-xs">
          👆 탭하여 넘기기 / 꾹 눌러 감독하기
        </span>
      </div>

      {/* 리믹스 로딩 오버레이 */}
      {isRemixing && (
        <div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-black/70"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
        >
          <div
            className="h-10 w-10 rounded-full border-2 border-white border-t-transparent animate-spin"
            aria-hidden
          />
          <p className="text-center text-lg font-medium text-white">
            🔄 AI 배우들이 대본을 고치는 중...
          </p>
        </div>
      )}

      {/* 감독 모드 시에만 표시 — 보라색 UI (리믹스 버튼) */}
      {directorMode && !isRemixing && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 px-6 py-10">
          <p className="font-cinema text-center text-sm font-medium text-white/90 tracking-wide sm:text-base">
            감독 모드
          </p>
          <button
            type="button"
            className="font-cinema rounded-md bg-violet-600/95 px-6 py-2.5 text-sm font-medium text-white shadow-lg transition hover:bg-violet-500"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onClick={handleRemixClick}
          >
            리믹스
          </button>
        </div>
      )}
    </div>
  );
}
