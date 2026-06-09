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
    taskHostContext: unknown;
  }) => {
    const context = normalizePaymentMtNackContext(params.taskHostContext);

    if (!context.taskId || !context.step || !context.tradeId) {
      throw new Error("Payment MT NACK context is incomplete");
    }

    return context;
  },

  getMtValidationErrors: async (params: {
    context: {
      taskId: string;
      step: string;
      tradeId: string;
    };
    taskHostContext: unknown;
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

function normalizePaymentMtNackContext(_taskHostContext: unknown): {
  taskId: string;
  step: string;
  tradeId: string;
} {
  throw new Error("Implement in the project source adapter layer");
}

function normalizeMtValidationErrors(_params: {
  context: {
    taskId: string;
    step: string;
    tradeId: string;
  };
  taskHostContext: unknown;
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
