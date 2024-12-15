import { Injectable } from '@nestjs/common';

@Injectable()
export class GeneratePasswordUsecase {
  public execute(
    length: number,
    useUpperCase: boolean = true,
    useLowerCase: boolean = true,
    useNumbers: boolean = true,
    useSymbols: boolean = true,
  ): string {
    let charPool;
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';

    if (useUpperCase) charPool += upperCase;
    if (useLowerCase) charPool += lowerCase;
    if (useNumbers) charPool += numbers;
    if (useSymbols)
      charPool += symbols.charAt(Math.floor(Math.random() * symbols.length));

    if (charPool.length === 0) {
      throw new Error('At least one character type must be selected.');
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      password += charPool.charAt(Math.floor(Math.random() * charPool.length));
    }
    return password;
  }
}
