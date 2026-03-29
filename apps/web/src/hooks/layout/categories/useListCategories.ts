import {
  CATEGORY_QUERY_KEYS,
  DEFAULT_QUERY_STALE_TIME,
} from "@/src/core/constants";
import { IPaginatedQuery } from "@/src/core/types/query";
import { CategoriesService } from "@/src/services/catégories";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useListCategories = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const categoriesService = new CategoriesService();

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: CATEGORY_QUERY_KEYS.list,
    queryFn: async () => {
      const query: IPaginatedQuery = {
        limit,
        page,
      };
      return await categoriesService.list(query);
    },
    retry: false,
    staleTime: DEFAULT_QUERY_STALE_TIME,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Erreur lors du chargement des catégories");
    }
  }, [isError]);

  return {
    page,
    limit,
    categories,
    isLoading,
    isError,
    setPage,
    setLimit,
  };
};
