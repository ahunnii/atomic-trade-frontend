import {
  EmailBody,
  EmailColumn,
  EmailCustomLogo,
  EmailSignature,
  EmailText,
} from "@atomic-trade/email";

type Props = {
  email: string;
  storeName: string;
  previewText?: string;
  unsubscribeUrl: string;
  isPreview?: boolean;
  logoUrl: string;
};

export const NewsletterConfirmedEmail = (props: Props) => (
  <EmailBody
    previewText={
      props.previewText ?? `Welcome to ${props.storeName}'s newsletter`
    }
    isPreview={props.isPreview}
  >
    <EmailColumn pX={25}>
      <EmailCustomLogo logoUrl={props?.logoUrl ?? ""} />
      <EmailText>Welcome to {props.storeName}!</EmailText>

      <EmailText>
        Thank you for joining our community! We&apos;re excited to share our
        latest products, exclusive offers, and insider updates with you.
      </EmailText>

      <EmailText>
        Look out for our next newsletter in your inbox soon. We promise to only
        send you content we think you&apos;ll love.
      </EmailText>
    </EmailColumn>

    <EmailColumn pX={25}>
      <EmailText style={{ fontSize: "12px", color: "#666", marginTop: "24px" }}>
        To unsubscribe from our newsletter,{" "}
        <a href={props.isPreview ? "#!" : props.unsubscribeUrl}>click here</a>
      </EmailText>
    </EmailColumn>
    <EmailSignature name={props.storeName} />
  </EmailBody>
);
