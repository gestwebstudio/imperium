import { stdin, stdout } from "node:process";
import { hash } from "bcryptjs";

async function readPassword() {
  if (!stdin.isTTY) {
    let value = "";
    for await (const chunk of stdin) value += chunk;
    return value.replace(/[\r\n]+$/, "");
  }

  stdout.write("Введите пароль администратора: ");
  stdin.setRawMode(true);
  stdin.resume();

  return new Promise((resolve, reject) => {
    let value = "";

    const finish = () => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.off("data", onData);
      stdout.write("\n");
      resolve(value);
    };

    const onData = (chunk) => {
      const key = chunk.toString("utf8");
      if (key === "\u0003") {
        stdin.setRawMode(false);
        stdin.pause();
        reject(new Error("Операция отменена."));
        return;
      }
      if (key === "\r" || key === "\n") {
        finish();
        return;
      }
      if (key === "\u007f" || key === "\b") {
        value = value.slice(0, -1);
        return;
      }
      if (/^[^\u0000-\u001f\u007f]+$/.test(key)) value += key;
    };

    stdin.on("data", onData);
  });
}

try {
  const password = await readPassword();
  if (password.length < 12) {
    throw new Error("Пароль должен содержать не менее 12 символов.");
  }
  if (password.length > 1024) {
    throw new Error("Пароль слишком длинный.");
  }

  stdout.write(`${await hash(password, 12)}\n`);
} catch (error) {
  const message =
    error instanceof Error ? error.message : "Не удалось создать hash.";
  console.error(message);
  process.exitCode = 1;
}
