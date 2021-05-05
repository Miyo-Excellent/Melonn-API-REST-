import morgan from 'morgan';
import { Handler } from 'express';

export type StreamCallbackType = (data: {
  message: string;
  status: number;
}) => void;

export default (callback: StreamCallbackType): Handler => {
  let status: number;

  return morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {
      stream: {
        write: (message: string) => callback({ message, status }),
      },
      skip: (request, response) => {
        status = request.statusCode || 400;

        return false;
      },
    },
  );
};
