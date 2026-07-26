
async function listAndDeleteRecentPosts() {
  const token = 'EAAX3rnZBMIP4BSPoChu1AjWwjx4DBykQ2yONLZBmEm2CF1RbhfKY9y795LTt2nYCqvrXZAXDUvZAFNowzwZBvc4Xj5ofUP70mF6tuthlFe758Ib4qvEUZAyMkfZAgXKkL1a9PwJa99FC1ZCEkK6biu8dzsZBeYJt2Pj7o8ep4tpY4dl39BPOkUj8GGqx83CxSUBkSdKHMZAvdQCf5DJP0EZAIiNwiZAtoJxSPELen6oiDw7nyvQRX92AtjwVsAPj6bhdDmI1NMfcOkzX67MK6nJ1bI4ZA5u8PznWk2KTd8Is4kgZDZD';
  const instaId = '17841403614375396';

  console.log('Fetching media items from Instagram account...');
  const res = await fetch(`https://graph.facebook.com/v18.0/${instaId}/media?fields=id,caption,timestamp,permalink&access_token=${token}`);
  const data = await res.json() as any;

  if (!data.data || !Array.isArray(data.data)) {
    console.error('Failed to fetch media:', data);
    return;
  }

  console.log(`Found ${data.data.length} recent media items on Instagram:`);
  
  for (const item of data.data) {
    console.log(`ID: ${item.id} | Date: ${item.timestamp} | Caption sample: ${item.caption ? item.caption.substring(0, 40) : 'No caption'}`);
    
    // Attempt delete
    const delRes = await fetch(`https://graph.facebook.com/v18.0/${item.id}?access_token=${token}`, {
      method: 'DELETE'
    });
    const delData = await delRes.json() as any;
    console.log(`Deletion response for ${item.id}:`, delData);
  }
}

listAndDeleteRecentPosts();
