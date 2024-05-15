import React from 'react';
import styles from './Login.module.scss';
import { SFButton, SFTextField } from 'sfui';

export interface LoginFormValue {
  email: string;
  password: string;
}

export interface LoginProps {
  onLogin: (value: LoginFormValue) => void;
}

export const Login = ({
  onLogin
}: LoginProps): React.ReactElement<LoginProps> => {
  const [value, setValue] = React.useState<LoginFormValue>({
    email: '',
    password: ''
  });

  const disabled: boolean =
    value.email.length === 0 || value.password.length === 0;

  const onKeyUp = (e: { key: string }) => {
    if (e.key === 'Enter' && !disabled) {
      onLogin(value);
    }
  };

  return (
    <div className={styles.login} onKeyUp={onKeyUp}>
      <form>
        <SFTextField
          label="E-mail"
          type="email"
          value={value.email}
          autoFocus
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setValue((v) => ({ ...v, email: e.target.value.toLowerCase() }))
          }
        />

        <SFTextField
          label="Password"
          type="password"
          value={value.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setValue((v) => ({ ...v, password: e.target.value }))
          }
        />
      </form>

      <SFButton disabled={disabled} onClick={() => onLogin(value)}>
        Log in
      </SFButton>
    </div>
  );
};
