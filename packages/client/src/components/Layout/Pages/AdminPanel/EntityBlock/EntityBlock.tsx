import { Box } from "@mui/material";
import DynamicForm, { RequestInfoBlock } from "../DynamicForm/DynamicForm";
import "./EntityBlock.css";

export type RequestInfoBlockGroup = {
  text: string;
  path: string;
  requests: RequestInfoBlock[];
};

type DynamicFormProps = {
  requestsGroup: RequestInfoBlockGroup;
};

const EntityBlock = ({ requestsGroup }: DynamicFormProps) => {
  return (
    <Box className="entity-block">
      {requestsGroup.requests.map((request, index) => (
        <DynamicForm key={index} path={requestsGroup.path} request={request} />
      ))}
    </Box>
  );
};

export default EntityBlock;
