import { useContext } from 'solid-js';
import { MailContext } from './MailProvider';

export function useMail() {
  const context = useContext(MailContext);
  if (context === undefined) {
    throw new Error('useMail must be used within a MailProvider');
  }
  return context;
}