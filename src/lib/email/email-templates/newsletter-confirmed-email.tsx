import { SingleColumn } from "responsive-react-email";

import { Text } from "@react-email/components";

import { EmailBody, EmailSignature } from "~/lib/email/components";
import { EmailCustomLogo } from "../components/email-custom-logo";

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
    <SingleColumn pX={25}>
      <EmailCustomLogo logoUrl={props?.logoUrl ?? ""} />
      <Text>Welcome to {props.storeName}!</Text>

      <Text>
        Thank you for joining our community! We&apos;re excited to share our
        latest products, exclusive offers, and insider updates with you.
      </Text>

      <Text>
        Look out for our next newsletter in your inbox soon. We promise to only
        send you content we think you&apos;ll love.
      </Text>
    </SingleColumn>

    <SingleColumn pX={25}>
      <Text style={{ fontSize: "12px", color: "#666", marginTop: "24px" }}>
        To unsubscribe from our newsletter,{" "}
        <a href={props.isPreview ? "#!" : props.unsubscribeUrl}>click here</a>
      </Text>
    </SingleColumn>
    <EmailSignature name={props.storeName} />
  </EmailBody>
);
