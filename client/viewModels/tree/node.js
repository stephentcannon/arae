Meteor.startup(function(){
    // Avoid some bugs when selected_file is not set
    Session.set('selected_file', 0);
});

/**
 * Retrieve a node tree
 */
Template.node.node = function() {
    /* If tree has not been defined, we get it from the database */
    // See var tree in tree.js
    if ( tree === undefined || tree === null ) {
        tree = DocumentTree.findOne({_id:Session.get('tree_id')});
        /* We wait for tree to be defined ( Database can sometimes take a "while" to answer ) */
        if ( tree ) {
            tree = tree.root;
            Session.set('current_tree', tree);
            return tree;
        } else {
            return [];
        }
    } else {
        return tree;
    }
};

/**
 * Parse a node recursively
 * @param node
 */
Template.node.parse = function(node) {
    if ( node.is_dir ) {
        tree = node.tree;
        return node;
    } else {
        return node;
    }
};

/**
 * If the name is too long, slice it
 * @param name
 * @return {String}
 */
Template.node.shorten_name = function(name) {
    if ( name && name.length > 30 )
        return name.substring(0, 30);
    return name;
};

/**
 * Check if a user can edit a node (He has the tree_id or is admin)
 * return {Boolean}
 */
// TODO: Should refactor the user.name === admin;
Template.node.user_can_edit = function() {
    var user = Session.get('user');
    if ( user ) {
        return ((user.tree_id === Session.get('tree_id')) || user.name === 'admin');
    }
    return false;
};

/**
 * Check if user have rights for this node or if user is admin
 * @param node
 * @return {Boolean}
 */
// TODO: Should refactor the user.name === admin;
Template.node.collaborator_allowed_to_edit = function(node) {
    var user = Session.get('user');
    if ( user )
        return _.contains(node.users, user.name) || (user.name === 'admin');

    return false;
};

/**
 * Check if the current node is the root directory
 * @return {Boolean}
 */
Template.node.is_not_root = function() {
    if ( !this.root )
        return true;

    return false;
};

