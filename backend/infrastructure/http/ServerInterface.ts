export interface ServerInterface {
  start(port: number): Promise<void>;
  stop(): Promise<void>;
}
