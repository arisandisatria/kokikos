import { supabase } from "@/utils/supabase";
import { useState } from "react";

export default async function FetchRecipes() {
  const pageLimit = 10
  const [currentPageLimit, setCurrentPageLimit] = useState(pageLimit)
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  try {
    const {data, error} = await supabase.from("recipes").select("*").range(0, pageLimit - 1)

    if(error) throw Error;

    if (data) {
      setRecipes(data)

      if (data.length < pageLimit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }
  } catch (error) {
   console.error("Terjadi kesalahan:", error)
  } finally {
    setLoading(false);
    setLoadingMore(false);
  }

  return
}
