import {getRequestConfig} from 'next-intl/server';
import { DefaultLanguage, type Languages, Messages } from '~/translations';

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale: Languages = DefaultLanguage;
 
  return {
    locale,
    messages: Messages,
  };
});