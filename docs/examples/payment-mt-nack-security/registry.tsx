import type { ComponentType } from "react";

import {
  FinishTaskButton,
  NackResolutionRadioGroup,
  PageFooterActions,
  PaymentMtNackSecurityPage,
  TradeSidePage,
  TradeSidePageTrigger,
  ValidationErrorsBlock,
} from "@/features/payment-mt-nack-security/components";

export const paymentMtNackSecurityRegistry = {
  PaymentMtNackSecurityPage,
  ValidationErrorsBlock,
  TradeSidePageTrigger,
  TradeSidePage,
  NackResolutionRadioGroup,
  PageFooterActions,
  FinishTaskButton,
} satisfies Record<string, ComponentType<unknown>>;

export const paymentMtNackSecurityResolvers = {
  getPaymentMtNackContext: async (params: {
    taskId?: string;
    step?: string;
    tradeId?: string;
  }) => {
    if (!params.taskId || !params.step || !params.tradeId) {
      throw new Error("Payment MT NACK context is incomplete");
    }

    return {
      taskId: params.taskId,
      step: params.step,
      tradeId: params.tradeId,
    };
  },

  getMtValidationErrors: async (params: {
    step: string;
    rejectionReason?: string;
    rejectionDocument?: string;
  }) => {
    return normalizeMtValidationErrors(params);
  },

  finishPaymentMtNackSecurity: async (params: {
    taskId: string;
    tradeId: string;
    decision: "fixStaticData" | "fixSigners" | "sendToReprocess" | "allCorrect";
  }) => {
    return finishTaskWithNackDecision(params);
  },
};

function normalizeMtValidationErrors(_params: {
  step: string;
  rejectionReason?: string;
  rejectionDocument?: string;
}) {
  throw new Error("Implement in the project adapter layer");
}

function finishTaskWithNackDecision(_params: {
  taskId: string;
  tradeId: string;
  decision: "fixStaticData" | "fixSigners" | "sendToReprocess" | "allCorrect";
}) {
  throw new Error("Implement in the project action adapter layer");
}
