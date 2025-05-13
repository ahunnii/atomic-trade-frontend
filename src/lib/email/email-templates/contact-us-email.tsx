import { SingleColumn } from "responsive-react-email";

import { Text } from "@react-email/components";

import {
  EmailBody,
  EmailCallToActionButton,
  EmailImportantText,
  EmailLogo,
  EmailSignature,
} from "~/lib/email/components";

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
    <SingleColumn pX={25}>
      <EmailLogo />
      <Text>Greetings from {props.storeName},</Text>

      <Text>
        {props.name} has contacted you via the contact form on your website:
      </Text>
      <EmailImportantText>{props.message}</EmailImportantText>
    </SingleColumn>

    <SingleColumn pX={25}>
      <Text style={{ marginBottom: 4 }}>
        You can respond by replying to this email or by reaching out to them
        directly in a separate email below.
      </Text>

      <EmailCallToActionButton
        link={props.isPreview ? "#!" : `mailto:${props.email}`}
        label="Respond in new email"
        style={{
          margin: "24px 0 24px",
        }}
      />
    </SingleColumn>
    <EmailSignature name={props.storeName} />
  </EmailBody>
);
