import { useMemo } from 'react'

// Import the graph and its built-in navigation components
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType
} from '@xyflow/react'

import '@xyflow/react/dist/style.css'

function RelationshipGraph({ character }) {
  /*
    useMemo prevents the graph data from being rebuilt during
    every render unless the selected character changes.
  */
  const { nodes, edges } = useMemo(() => {
    // Safely retrieve relationships from the selected character
    const relationships = character.relationships || []

    /*
      Create the center node.
      This node represents the currently selected character.
    */
    const centerNode = {
      id: `main-${character.id}`,

      // Place the selected character near the center
      position: {
        x: 350,
        y: 220
      },

      // Text displayed inside the node
      data: {
        label: `${character.name || 'Unnamed Character'}\n${
          character.role || 'Main Character'
        }`
      },

      // Apply a special class to the selected character
      className: 'relationshipMainNode'
    }

    /*
      Turn every relationship entry into a graph node.
      Nodes are placed in a circle around the selected character.
    */
    const relationshipNodes = relationships.map((relationship, index) => {
      // Determine the angle for this relationship node
      const angle =
        (index / Math.max(relationships.length, 1)) * Math.PI * 2

      // Distance from the center character
      const radiusX = 260
      const radiusY = 180

      return {
        id: `relationship-${relationship.id}`,

        // Position the node around the center node
        position: {
          x: 350 + Math.cos(angle) * radiusX,
          y: 220 + Math.sin(angle) * radiusY
        },

        // Display the related character's name
        data: {
          label: relationship.relatedName || 'Unnamed Character'
        },

        className: 'relationshipPersonNode'
      }
    })

    /*
      Create one connecting edge for every relationship.
      The edge goes from the selected character to the
      related character.
    */
    const relationshipEdges = relationships.map(relationship => ({
      id: `edge-${relationship.id}`,

      // Start from the selected character
      source: `main-${character.id}`,

      // End at the related character
      target: `relationship-${relationship.id}`,

      // Display relationship type on the connecting line
      label: relationship.type || 'Related',

      // Use a curved connection
      type: 'smoothstep',

      // Add an arrow at the end of the edge
      markerEnd: {
        type: MarkerType.ArrowClosed
      },

      className: 'relationshipEdge'
    }))

    return {
      nodes: [centerNode, ...relationshipNodes],
      edges: relationshipEdges
    }
  }, [character])

  // Show a message when the character has no relationships
  if (!character.relationships?.length) {
    return (
      <div className="graphEmptyState">
        <h4>No relationships to visualize</h4>

        <p>
          Add at least one relationship above to generate the graph.
        </p>
      </div>
    )
  }

  return (
    <div className="relationshipGraph">
      <ReactFlow
        // Nodes displayed inside the graph
        nodes={nodes}

        // Connections displayed between nodes
        edges={edges}

        // Automatically position the camera around all nodes
        fitView

        // Leave space around the graph when fitting the view
        fitViewOptions={{
          padding: 0.25
        }}

        // Allow users to drag the character nodes
        nodesDraggable={true}

        // Prevent users from creating new connections manually
        nodesConnectable={false}

        // Allow users to select graph elements
        elementsSelectable={true}

        // Keep the attribution visible for the open-source library
        proOptions={{
          hideAttribution: true
        }}
      >
        {/* Dotted graph background */}
        <Background gap={20} size={1} />

        {/* Zoom, fit-view, and lock controls */}
        <Controls />

        {/* Small overview map */}
        <MiniMap
          pannable
          zoomable
          nodeStrokeWidth={3}
        />
      </ReactFlow>
    </div>
  )
}

export default RelationshipGraph