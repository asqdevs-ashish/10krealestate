import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

/**
 * Password hashing for CMS accounts.
 *
 * `scrypt` ships with Node, so agent credentials can be stored safely without
 * pulling in a native build toolchain (bcrypt/argon2). Parameters are fixed
 * here and encoded into the stored string, so they can be raised later without
 * invalidating existing hashes.
 *
 * Only `node:crypto` is used, which keeps this unusable from a browser bundle
 * by construction.
 */

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: string,
  keyLength: number,
) => Promise<Buffer>;

const SCHEME = "scrypt";
const KEY_LENGTH = 64;
const SALT_BYTES = 16;

/** `scrypt:<salt-hex>:<hash-hex>` */
export async function hashPassword(password: string): Promise<string> {
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }
  const salt = randomBytes(SALT_BYTES).toString("hex");
  const derived = await scrypt(password, salt, KEY_LENGTH);
  return `${SCHEME}:${salt}:${derived.toString("hex")}`;
}

/** Constant-time comparison, so a wrong password cannot be timed out. */
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [scheme, salt, hash] = stored.split(":");
  if (scheme !== SCHEME || !salt || !hash) return false;

  const expected = Buffer.from(hash, "hex");
  if (expected.length !== KEY_LENGTH) return false;

  const derived = await scrypt(password, salt, KEY_LENGTH);
  return timingSafeEqual(derived, expected);
}
