
export default function useAuth() {
  return process.env.NODE_ENV === 'production' || process.env.REACT_APP_USE_AUTH ;
}
