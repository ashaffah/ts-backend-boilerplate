import fastify, { FastifyInstance } from "fastify";
import fastifyMiddie from "@fastify/middie";
import fastifyCors from "@fastify/cors";
import type { FastifyCookieOptions } from "@fastify/cookie";
import fastifyCookie from "@fastify/cookie";
import { fastifyJwt } from "@fastify/jwt";
import { loggerConfig } from "./logger.config";
import { getEnv } from "./env.validation";

const app: FastifyInstance = fastify({
  logger: loggerConfig,
});

const env = getEnv();

// CORS
app.register(fastifyCors, {
  origin: (origin, cb) => {
    const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];

    if (!origin || allowedOrigins.includes(origin)) {
      app.log.info({ origin }, "CORS origin allowed");

      cb(null, true);
      return;
    }
    app.log.warn({ origin }, "CORS origin not allowed");
    cb(new Error("Not allowed"), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
});

// Cookie
const cookieOptions: FastifyCookieOptions = {
  secret: env.COOKIE_SECRET || "default_secret_key",
  parseOptions: {},
};
app.register(fastifyCookie, cookieOptions);

// Middie for middleware support
app.register(fastifyMiddie);

// JWT
app.register(fastifyJwt, {
  secret: env.SECRET_KEY as string,
  sign: { algorithm: "HS512" },
});

// Global api prefix
app.register(
  function (api, opts, done): void {
    /**
     * MIDDLEWARE
     */
    // api.addHook("onRequest", async (req, res) => {
    //   if (guestRoutes.includes(req.originalUrl)) return;
    //   await verifyToken(req, res);
    // });
    /**
     * ROUTES
     * Register feature routes di sini
     */
    // api.register(authRoutes, { prefix: "/auth" });
    // api.register(userRoutes, { prefix: "/users" });
    done();
  },
  { prefix: "/api/v1" },
);

/** Prevent BigInt serialization issues
 *  ref:
 *  https://stackoverflow.com/a/78681416/13030162
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
 */
/**
 * Extends the global `BigInt` interface to include a `toJSON` method.
 *
 * The `toJSON` method allows `BigInt` values to be serialized to JSON by converting them to a `number`.
 * Note: This may result in loss of precision for large `BigInt` values that exceed the safe integer range.
 */
declare global {
  interface BigInt {
    toJSON(): number;
  }
}

BigInt.prototype.toJSON = function () {
  return Number(this.toString());
};

export { app };
