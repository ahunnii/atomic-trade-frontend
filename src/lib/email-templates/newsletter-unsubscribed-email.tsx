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
    <EmailColumn pX={25}>
      <EmailCustomLogo logoUrl={props?.logoUrl ?? ""} />
      <EmailText>
        You&apos;ve been unsubscribed from {props.storeName}&apos;s newsletter
      </EmailText>

      <EmailText>
        We&apos;re sorry to see you go! You have been successfully unsubscribed
        from our newsletter and will no longer receive updates from us.
      </EmailText>

      <EmailText>
        If you change your mind, you can always resubscribe through our website.
        We hope to see you again soon!
      </EmailText>
    </EmailColumn>

    <EmailColumn pX={25}>
      <EmailText style={{ fontSize: "12px", color: "#666", marginTop: "24px" }}>
        If you did not request to unsubscribe, please contact our support team.
      </EmailText>
    </EmailColumn>
    <EmailSignature name={props.storeName} />
  </EmailBody>
);
