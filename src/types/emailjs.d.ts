// Type definitions for EmailJS SDK
declare module '@emailjs/browser' {
  export function init(publicKey: string): void;
  
  export function send(
    serviceId: string,
    templateId: string,
    templateParams?: Record<string, unknown>,
    publicKey?: string
  ): Promise<{
    status: number;
    text: string;
  }>;
}
