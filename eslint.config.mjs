import nextConfig from "eslint-config-next"

const eslintConfig = [
  ...nextConfig,
  {
    ignores: ["data/**", ".next/**"],
  },
  {
    rules: {
      // eslint-plugin-react-hooks@7 flags setState reachable from an effect body
      // even through an intermediate function (e.g. a useCallback data-fetcher, or
      // the SSR-safe "restore from localStorage after mount" pattern used for the
      // locale toggle). Both are standard, hydration-safe idioms here — kept as a
      // warning so genuine cascades still surface without failing CI on them.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]

export default eslintConfig
