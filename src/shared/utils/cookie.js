export const getCookie = name => {
  const dc = document.cookie;
  const prefix = `${name}=`;
  let begin = dc.indexOf(`; ${prefix}`);
  let end; // undefined is okay (but not null)

  if (begin === -1) {
    begin = dc.indexOf(prefix);
    if (begin !== 0) return null;
  } else {
    begin += 2;
    end = document.cookie.indexOf(';', begin);
    if (end === -1) {
      end = dc.length;
    }
  }
  return decodeURIComponent(dc.substring(begin + prefix.length, end));
};
