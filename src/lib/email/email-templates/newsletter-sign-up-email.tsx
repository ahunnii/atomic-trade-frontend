import { SingleColumn } from "responsive-react-email";

import { Text } from "@react-email/components";

import {
  EmailBody,
  EmailCallToActionButton,
  EmailSignature,
} from "~/lib/email/components";
import { EmailCustomLogo } from "../components/email-custom-logo";

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
    <SingleColumn pX={25}>
      <EmailCustomLogo logoUrl={props?.logoUrl ?? ""} />
      <Text>Greetings from {props.storeName},</Text>

      <Text>
        You are almost finished! To confirm your subscription to our newsletter,
        please click the button below:
      </Text>
    </SingleColumn>

    <SingleColumn pX={25}>
      <EmailCallToActionButton
        link={props.isPreview ? "#!" : props.confirmUrl}
        label="Click to confirm subscription"
        style={{
          margin: "24px 0 24px",
        }}
      />

      <Text>
        If this was a mistake, or if you don&apos;t want to receive our
        newsletter, you can safely ignore this email.
      </Text>
    </SingleColumn>
    <EmailSignature name={props.storeName} />
  </EmailBody>
);
