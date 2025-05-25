import {
  EmailBody,
  EmailCallToActionButton,
  EmailColumn,
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
  message: string;
  isPreview?: boolean;
};

export const ContactUsEmail = (props: Props) => (
  <EmailBody
    previewText={props.previewText ?? `New update from ${props.storeName}`}
    isPreview={props.isPreview}
  >
    <EmailColumn pX={25}>
      <EmailLogo />
      <EmailText>Greetings from {props.storeName},</EmailText>

      <EmailText>
        {props.name} has contacted you via the contact form on your website:
      </EmailText>
      <EmailImportantText>{props.message}</EmailImportantText>
    </EmailColumn>

    <EmailColumn pX={25}>
      <EmailText style={{ marginBottom: 4 }}>
        You can respond by replying to this email or by reaching out to them
        directly in a separate email below.
      </EmailText>

      <EmailCallToActionButton
        link={props.isPreview ? "#!" : `mailto:${props.email}`}
        label="Respond in new email"
        style={{
          margin: "24px 0 24px",
        }}
      />
    </EmailColumn>
    <EmailSignature name={props.storeName} />
  </EmailBody>
);
