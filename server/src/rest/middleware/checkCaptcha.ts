import tiny from 'tiny-json-http';

import { NextFunction, Request, Response } from 'express';

const verify = async function (request: Request) {
  const { recaptchaToken } = request.body;

  const verification = await tiny.post({
    url: `https://www.google.com/recaptcha/api/siteverify?response=${recaptchaToken}&secret=${process.env.RECAPTCHA_SECRET}`,
  });

  return verification;
};

export const checkCaptcha = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === 'development') {
    next();
    return;
  }
  verify(req).then(({ body: { success, score } }) => {
    if (!success || score < 0.5) {
      res.status(422).json({ message: 'Failed ReCaptcha' }).send();
      return;
    }
    //Call the next middleware or controller
    next();
  });
};
