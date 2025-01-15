export const verifyError = (field, error, setError) => {
  if (error) {
    setError((prevError) => ({...prevError, [field]: ''}));
  }
}
