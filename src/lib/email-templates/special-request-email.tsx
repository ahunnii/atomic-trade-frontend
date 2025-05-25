/* eslint-disable @next/next/no-img-element */
import {
  EmailBody,
  EmailCallToActionButton,
  EmailColumn,
  EmailImportantText,
  EmailLogo,
  EmailSignature,
  EmailText,
} from "@atomic-trade/email";
import { env } from "~/env";

type Props = {
  email: string;
  name: string;
  storeName: string;
  previewText?: string;
  message: string;
  images: string[];
  isPreview?: boolean;
  requestId: string;
  storeSlug: string;
};

export const SpecialRequestEmail = (props: Props) => (
  <EmailBody
    previewText={
      props.previewText ?? `New special request from ${props.storeName}`
    }
    isPreview={props.isPreview}
  >
    <EmailColumn pX={25}>
      <EmailLogo />
      <EmailText>Greetings from {props.storeName},</EmailText>

      <EmailText>
        {props.name} has contacted you via the special request form on your
        website:
      </EmailText>
      <EmailImportantText>{props.message}</EmailImportantText>
      {props.images.length > 0 && (
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <EmailText style={{ fontWeight: "bold", marginBottom: 10 }}>
            Reference Images:
          </EmailText>
          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            {props.images.map((image) => (
              <img
                src={`${env.NEXT_PUBLIC_STORAGE_URL}/product-requests/${image}`}
                alt="Special request reference"
                key={image}
                style={{
                  maxWidth: "100%",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </EmailColumn>

    <EmailColumn pX={25}>
      <EmailText style={{ marginBottom: 4 }}>
        You can inquire more about this request by replying to this email or by
        reaching out to them directly in a separate email below.
      </EmailText>

      <EmailCallToActionButton
        link={props.isPreview ? "#!" : `mailto:${props.email}`}
        label="Respond in new email"
        style={{
          margin: "24px 0 24px",
        }}
      />

      <div
        style={{
          textAlign: "center",
          margin: "0 0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          width: "100%",
        }}
      >
        <div
          style={{ height: "1px", width: "120px", backgroundColor: "#e5e7eb" }}
        />
        <EmailText
          style={{
            color: "#6b7280",
            fontStyle: "italic",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          or
        </EmailText>
        <div
          style={{ height: "1px", width: "120px", backgroundColor: "#e5e7eb" }}
        />
      </div>

      <EmailCallToActionButton
        link={
          props.isPreview
            ? "#!"
            : `${env.BACKEND_URL}/${props.storeSlug}/requests/${props.requestId}/edit`
        }
        label="View request details"
        style={{
          margin: "0 0 24px",
        }}
      />
    </EmailColumn>

    <EmailSignature name={props.storeName} />
  </EmailBody>
);
