import nodeFetch from 'node-fetch';

import { MethodsEnum } from './enums';

export type FetchType = {
  url: string;
  body?: any;
  method?: MethodsEnum;
  headers: {
    'Content-Type'?: string;
    'x-api-key': string;
  };
};

export default async function fetch({
  url,
  headers,
  method,
  body,
}: FetchType): Promise<any> {
  const methods: any = await nodeFetch(`${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    method: method || 'get',
    body: body ? JSON.stringify(body) : undefined,
  });

  return methods.json();
}
