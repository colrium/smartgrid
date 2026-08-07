/**
 * If you want to enable locale keys typechecking and enhance IDE experience.
 *
 * Requires `resolveJsonModule:true` in your tsconfig.json.
 *
 * @link https://www.i18next.com/overview/typescript
 */
import 'i18next'

// resources.ts file is generated with `npm run toc`
import resources from './resources.ts'

type TranslationValue = string | TranslationObject;
interface TranslationObject {
	[key: string]: TranslationValue;
}
declare module 'i18next' {
  interface CustomTypeOptions {
		defaultNS: "common";
		// resources: typeof resources; // strict typing for resources, but requires manual update of this file when locales change
		resources: Record<string, TranslationObject>; // loosens all key types
		// resources: Record<string, any>; // even looser
  }
}
