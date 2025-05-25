import { PaymentProcessorFactory } from "./factory";

export const paymentService =
  PaymentProcessorFactory.createPaymentService("stripe");

export const paymentServiceType = PaymentProcessorFactory.paymentProcessorType;
