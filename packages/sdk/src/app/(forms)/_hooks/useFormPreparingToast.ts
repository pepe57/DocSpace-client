"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { toastr } from "@docspace/ui-kit/components/toast";
import type { TFile } from "@docspace/shared/api/files/types";

export default function useFormPreparingToast(items: TFile[]) {
  const { t } = useTranslation(["Common"]);
  const prevRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const next = new Set<number>();

    for (const file of items) {
      if (file.isFillingPreparing) next.add(file.id);
      else if (prevRef.current.has(file.id)) {
        toastr.success(t("Common:ReadyToFillOut"));
      }
    }

    prevRef.current = next;
  }, [items, t]);
}
