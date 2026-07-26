"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type ButtonState = "idle" | "loading" | "success" | "error";

interface LoadingButtonProps {
  state?: ButtonState;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  loadingText?: string;
  successText?: string;
  icon?: IconDefinition;
  className?: string;
  disabled?: boolean;
}

export function LoadingButton({
  state = "idle",
  onClick,
  type = "button",
  children,
  loadingText,
  successText = "Tersimpan!",
  icon,
  className = "",
  disabled = false,
}: LoadingButtonProps) {
  const isLoading = state === "loading";
  const isSuccess = state === "success";
  const isError = state === "error";
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`relative flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.97] ${
        isDisabled ? "opacity-70 cursor-not-allowed" : ""
      } ${isSuccess ? "!bg-green-500 !text-white" : ""} ${className}`}
    >
      {/* Spinner */}
      {isLoading && (
        <FontAwesomeIcon
          icon={faSpinner}
          className="w-4 h-4 animate-spin flex-shrink-0"
        />
      )}

      {/* Success check */}
      {isSuccess && (
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="w-4 h-4 flex-shrink-0"
        />
      )}

      {/* Idle icon */}
      {!isLoading && !isSuccess && icon && (
        <FontAwesomeIcon icon={icon} className="w-4 h-4 flex-shrink-0" />
      )}

      {/* Label */}
      <span>
        {isLoading && loadingText
          ? loadingText
          : isSuccess
          ? successText
          : isError
          ? "Gagal, coba lagi"
          : children}
      </span>
    </button>
  );
}
