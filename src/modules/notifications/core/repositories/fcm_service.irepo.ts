export abstract class FcmServiceIRepo {
  abstract sendNotification(
    token: string,
    title: string,
    body: string,
    icon: string,
  ): Promise<void>;

  abstract sendNotificationToMultipleTokens(
    tokens: string[],
    title: string,
    body: string,
    icon: string,
  ): Promise<void>;

  abstract sendTopicNotification(
    topic: string,
    title: string,
    body: string,
    icon: string,
  ): Promise<void>;
}
