import {
  EmailBody,
  EmailCallToActionButton,
  EmailColumn,
  EmailCustomLogo,
  EmailImportantText,
  EmailLogo,
  EmailSignature,
  EmailText,
} from "@atomic-trade/email";

type Props = {
  email: string;
  name: string;
  storeName: string;
  previewText?: string;
  orderNumber: string;
  orderTotal: number;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  isPreview?: boolean;
  logoUrl: string;
};

export const ThankYouOrderEmail = (props: Props) => (
  <EmailBody
    previewText={
      props.previewText ?? `Thank you for your order from ${props.storeName}`
    }
    isPreview={props.isPreview}
  >
    <EmailColumn pX={25}>
      <EmailCustomLogo logoUrl={props.logoUrl} />
      <EmailText>Thank you for your order, {props.name}!</EmailText>

      <EmailText>
        We&apos;re excited to let you know that we&apos;ve received your order #
        {props.orderNumber}. We&apos;ll notify you when your order ships.
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
        If you have any questions about your order, please don&apos;t hesitate
        to contact us!
      </EmailText>
    </EmailColumn>
    <EmailSignature name={props.storeName} />
  </EmailBody>
);
