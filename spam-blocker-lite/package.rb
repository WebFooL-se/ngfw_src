# -*-ruby-*-

smtp = BuildEnv::SRC['untangle-casing-smtp']
spam = BuildEnv::SRC['untangle-base-spam'];

NodeBuilder.makeNode(BuildEnv::SRC, 'untangle-node-spam-blocker-lite', 'spam-blocker-lite', [smtp['src'], spam['src']])
