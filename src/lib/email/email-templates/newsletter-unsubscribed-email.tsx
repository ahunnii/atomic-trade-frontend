import { SingleColumn } from "responsive-react-email";

import { Text } from "@react-email/components";

import { EmailBody, EmailSignature } from "~/lib/email/components";
import { EmailCustomLogo } from "../components/email-custom-logo";

type Props = {
  email: string;
  storeName: string;
  previewText?: string;
  isPreview?: boolean;
  logoUrl: string;
};

export const NewsletterUnsubscribedEmail = (props: Props) => (
  <EmailBody
    previewText={
      props.previewText ??
      `You've been unsubscribed from ${props.storeName}'s newsletter`
    }
    isPreview={props.isPreview}
  >
    <SingleColumn pX={25}>
      <EmailCustomLogo logoUrl={props?.logoUrl ?? ""} />
      <Text>
        You&apos;ve been unsubscribed from {props.storeName}&apos;s newsletter
      </Text>

      <Text>
        We&apos;re sorry to see you go! You have been successfully unsubscribed
        from our newsletter and will no longer receive updates from us.
      </Text>

      <Text>
        If you change your mind, you can always resubscribe through our website.
        We hope to see you again soon!
      </Text>
    </SingleColumn>

    <SingleColumn pX={25}>
      <Text style={{ fontSize: "12px", color: "#666", marginTop: "24px" }}>
        If you did not request to unsubscribe, please contact our support team.
      </Text>
    </SingleColumn>
    <EmailSignature name={props.storeName} />
  </EmailBody>
);
