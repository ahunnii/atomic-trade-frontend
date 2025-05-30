import {
  EmailBody,
  EmailCallToActionButton,
  EmailColumn,
  EmailCustomLogo,
  EmailSignature,
  EmailText,
} from "@atomic-trade/email";

type Props = {
  email: string;
  storeName: string;
  previewText?: string;
  confirmUrl: string;
  isPreview?: boolean;
  logoUrl: string;
};

export const NewsletterSignUpEmail = (props: Props) => (
  <EmailBody
    previewText={props.previewText ?? `New update from ${props.storeName}`}
    isPreview={props.isPreview}
  >
    <EmailColumn pX={25}>
      <EmailCustomLogo logoUrl={props?.logoUrl ?? ""} />
      <EmailText>Greetings from {props.storeName},</EmailText>

      <EmailText>
        You are almost finished! To confirm your subscription to our newsletter,
        please click the button below:
      </EmailText>
    </EmailColumn>

    <EmailColumn pX={25}>
      <EmailCallToActionButton
        link={props.isPreview ? "#!" : props.confirmUrl}
        label="Click to confirm subscription"
        style={{
          margin: "24px 0 24px",
        }}
      />

      <EmailText>
        If this was a mistake, or if you don&apos;t want to receive our
        newsletter, you can safely ignore this email.
      </EmailText>
    </EmailColumn>
    <EmailSignature name={props.storeName} />
  </EmailBody>
);
