
export default function useRemoteApi() {
  return process.env.NODE_ENV === 'production' || process.env.REACT_APP_USE_API_CONFIG ;
}
