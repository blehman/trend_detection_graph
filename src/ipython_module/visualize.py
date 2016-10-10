import os
import jinja2 as jin

from IPython.core.display import display, HTML
#from . import __path__

def build_tye_chart(data, graph_id=1):
    """
    """
    path = os.path.join(os.path.dirname(__file__), '.')
    path = 'src/tye_chart/'
    template_env = jin.Environment(loader=jin.FileSystemLoader(path))
    index = template_env.get_template('tye_chart_index.tpl')

    d3_src = '/nbextensions/d3.js'

    output = index.render( { 'data': data,
                            'graph_id': graph_id,
                            'd3_url': d3_src
                            })

    return display(HTML(output))

