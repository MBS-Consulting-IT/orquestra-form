import { useField } from './core/useField'

export { useField }
export const useFields = fieldsConfig => fieldsConfig.forEach(useField)
