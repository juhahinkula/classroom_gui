import { useEffect, useState } from 'react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { CircularProgress } from '@mui/material';

interface GithubRepoTreeProps {
  repoUrl: string;
}

interface TreeNode {
  id: string;
  name: string;
  path: string;
  type: string;
  children?: TreeNode[];
}

function GithubRepoTree({ repoUrl }: GithubRepoTreeProps) {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRepoTree = () => {
      const repoPath = new URL(repoUrl).pathname.slice(1);
      const apiUrl = `https://api.github.com/repos/${repoPath}/git/trees/main?recursive=1`;

      fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
        throw new Error('Failed to fetch repository data');
        }
        return response.json();
      })
      .then((data) => {
        const tree = buildTree(data.tree);
        setTreeData(tree);
      })
      .catch((error) => {
        console.error('Error fetching repository tree:', error);
      })
      .finally(() => {
        setLoading(false);
      });
    };

    const buildTree = (nodes: any[]): TreeNode[] => {
      const root: TreeNode[] = [];
      const map: { [key: string]: TreeNode } = {};

      nodes.forEach((node) => {
        const parts = node.path.split('/');
        const name = parts.pop()!;
        const parentPath = parts.join('/');
        const treeNode: TreeNode = {
          id: node.path,
          name,
          path: node.path,
          type: node.type,
          children: [],
        };

        map[node.path] = treeNode;

        if (parentPath) {
          map[parentPath]?.children?.push(treeNode);
        } else {
          root.push(treeNode);
        }
      });

      return root;
    };

    fetchRepoTree();
  }, [repoUrl]);

  const renderTree = (nodes: TreeNode[]) =>
    nodes.map((node) => (
      <TreeItem key={node.path} itemId={node.path} label={node.name}>
        {node.children && renderTree(node.children)}
      </TreeItem>
    ));

  if (loading) {
    return <CircularProgress />;
  }

  console.log(treeData);

  return (
    <SimpleTreeView>
      {renderTree(treeData)}
    </SimpleTreeView>
  );
}

export default GithubRepoTree;