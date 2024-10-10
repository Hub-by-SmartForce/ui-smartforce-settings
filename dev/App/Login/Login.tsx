import React, { useContext } from 'react';
import styles from './Login.module.scss';
import { SFButton, SFSpinner, SFTextField } from 'sfui';
import { getUser, isLogin, login, logout } from '../../../src';
import { AuthContext } from '../App';
import { useHistory } from 'react-router-dom';
import { BASE_URL } from '../constants';

export interface LoginFormValue {
  email: string;
  password: string;
}

export const Login = (): React.ReactElement<{}> => {
  const history = useHistory();
  const { setIsLogged } = useContext(AuthContext);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const [value, setValue] = React.useState<LoginFormValue>({
    email: '',
    password: ''
  });

  React.useEffect(() => {
    const init = async () => {
      if (isLogin()) {
        try {
          await getUser(BASE_URL);
          setIsLoading(false);
          setIsLogged(true);
        } catch (e) {
          console.error(e);
          logout();
          setIsLoading(false);
          setIsLogged(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    init();
  }, [setIsLogged]);

  const disabled: boolean =
    value.email.length === 0 || value.password.length === 0;

  const onKeyUp = (e: { key: string }) => {
    if (e.key === 'Enter' && !disabled) {
      onLogin(value);
    }
  };

  const onLogin = async (formValue: LoginFormValue) => {
    try {
      setIsLoading(true);
      await login(BASE_URL, formValue.email, formValue.password);
      setIsLoading(false);
      setIsLogged(true);
      history.push('/main');
    } catch (e) {
      setIsLoading(false);
      setIsLogged(false);
      console.error(e);
    }
  };

  return (
    <div className={styles.login}>
      {isLoading && <SFSpinner aria-label="Validating user" />}

      {!isLoading && (
        <div className={styles.form} role="presentation" onKeyUp={onKeyUp}>
          <SFTextField
            label="E-mail"
            type="email"
            value={value.email}
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
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

          <SFButton disabled={disabled} onClick={() => onLogin(value)}>
            Log in
          </SFButton>
        </div>
      )}
    </div>
  );
};
