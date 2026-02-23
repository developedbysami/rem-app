export const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isProfile: boolean, setProfileImage, setCertificate) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (isProfile) setProfileImage(reader.result as string);
        else setCertificate({ name: file.name, size: file.size, data: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };