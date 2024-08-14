export type LoginInputModel = {
  loginOrEmail: string;
  password: string;
};

export type MeViewModel = {
email:	string;
login:	string;
userId:	string;
};

export type LoginSuccessViewModel = {
  accessToken: string;
};

export type RegistrationConfirmationCodeModel = {
  code: string;
};

export type RegistrationEmailResending = {
  email: string;
};

export type FilterDocument = {
  ip: string;
  URL: string;
  date: Date
}

export type NewPasswordRecoveryInputModel = {
  newPassword: string;
  recoveryCode: string
}