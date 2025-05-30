import {
  EmailBody,
  EmailCallToActionButton,
  EmailColumn,
  EmailCustomLogo,
  EmailImportantText,
  EmailSignature,
  EmailText,
} from "@atomic-trade/email";

import { env } from "~/env";

type Props = {
  orderNumber: string;
  customerName: string;
  storeName: string;
  previewText?: string;
  orderTotal: number;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  isPreview?: boolean;
  orderId: string;
  logoUrl: string;
  adminUrl: string;
};

export const NewOrderEmail = (props: Props) => (
  <EmailBody
    previewText={
      props.previewText ?? `New order #${props.orderNumber} received`
    }
    isPreview={props.isPreview}
  >
    <EmailColumn pX={25}>
      <EmailCustomLogo logoUrl={props.logoUrl} />
      <EmailText>New Order Alert!</EmailText>

      <EmailText>
        Order #{props.orderNumber} has been placed by {props.customerName} and
        is awaiting fulfillment.
      </EmailText>

      <EmailImportantText>
        Order Summary:
        {props.orderItems.map((item) => (
          <div key={item.name} style={{ marginTop: 8 }}>
            {item.quantity}x {item.name} - ${(item.price / 100).toFixed(2)}
          </div>
        ))}
        <div style={{ marginTop: 16, fontWeight: "bold" }}>
          Total: ${(props.orderTotal / 100).toFixed(2)}
        </div>
      </EmailImportantText>
    </EmailColumn>

    <EmailColumn pX={25}>
      <EmailText style={{ marginBottom: 4 }}>
        Please process this order as soon as possible. You can view the full
        order details in your admin dashboard.
      </EmailText>

      <EmailCallToActionButton
        link={
          props.isPreview ? "#!" : `${props.adminUrl}/orders/${props.orderId}`
        }
        label="View Order Details"
        style={{
          margin: "24px 0 24px",
        }}
      />
    </EmailColumn>
    <EmailSignature name={props.storeName} />
  </EmailBody>
);
