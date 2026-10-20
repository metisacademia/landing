import { forwardRef, type AnchorHTMLAttributes } from "react";
import { trackWhatsAppClick, whatsappHref } from "@/lib/whatsapp";

type WhatsAppAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  position: string;
  message: string;
};

export const WhatsAppAnchor = forwardRef<HTMLAnchorElement, WhatsAppAnchorProps>(
  function WhatsAppAnchor({ position, message, onClick, children, ...rest }, ref) {
    return (
      <a
        ref={ref}
        href={whatsappHref(message)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => {
          trackWhatsAppClick(position);
          onClick?.(event);
        }}
        {...rest}
      >
        {children}
      </a>
    );
  },
);
