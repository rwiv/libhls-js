export type HttpRequestHeaders = {[p: string]: string};

export interface HlsDownloader {

  download(): Promise<void>;
}
