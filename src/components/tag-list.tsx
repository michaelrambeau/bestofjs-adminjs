import React from "react";
import { unflatten } from "flat";
import { Box, Link } from "@adminjs/design-system";
import { Link as RouterLink } from "react-router-dom";

interface TagListProps {
  record: {
    populated: { tags: { [key: string]: unknown } };
  };
}

const TagList = (props: TagListProps) => {
  // @ts-ignore
  const { tags } = unflatten(props.record.populated);
  return (
    <Box display="flex" flexWrap="wrap" margin={-3}>
      {tags.map(({ params }) => (
        <Tag key={params.code} tag={params} />
      ))}
    </Box>
  );
};

type Tag = { _id: string; name: string; code: string };

const Tag = ({ tag }: { tag: Tag }) => {
  return (
    <Box margin={3}>
      <Link
        to={`/admin/resources/Project?filters.tags=${tag._id}`}
        as={RouterLink}
      >
        {tag.name}
      </Link>
    </Box>
  );
};

export default TagList;
